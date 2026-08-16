import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase.js";
import { EMPTY_KPIS, queryKeys } from "../lib/queries.js";

export function useRealtimeQuery({
  queryKey,
  queryFn,
  table,
  schema = "public",
  event = "*",
  filter,
  enabled = true,
  placeholderData = [],
  staleTime = 15_000,
  ...queryOptions
}) {
  const queryClient = useQueryClient();
  const [live, setLive] = useState(false);
  const keyHash = JSON.stringify(queryKey);
  const keyStable = useMemo(() => queryKey, [keyHash]);

  const query = useQuery({
    queryKey: keyStable,
    queryFn,
    enabled,
    placeholderData,
    staleTime,
    refetchOnWindowFocus: true,
    retry: 1,
    ...queryOptions,
  });

  useEffect(() => {
    if (!enabled || !table) return undefined;
    const channel = supabase
      .channel(`si:${schema}:${table}:${keyHash}`)
      .on(
        "postgres_changes",
        { event, schema, table, ...(filter ? { filter } : {}) },
        () => {
          queryClient.invalidateQueries({ queryKey: keyStable });
        }
      )
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED");
      });
    return () => {
      setLive(false);
      supabase.removeChannel(channel);
    };
  }, [enabled, table, schema, event, filter, queryClient, keyStable, keyHash]);

  const rows = query.data ?? placeholderData;
  const isEmpty = !query.isFetching && Array.isArray(rows) && rows.length === 0;
  return { ...query, data: rows, live, isEmpty };
}

export function useRealtimeKpis(queryFn) {
  const queryClient = useQueryClient();
  const [liveCount, setLiveCount] = useState(0);
  const query = useQuery({
    queryKey: queryKeys.metrics,
    queryFn,
    placeholderData: EMPTY_KPIS,
    staleTime: 15_000,
    retry: 1,
  });
  useEffect(() => {
    const tables = ["users", "support_tickets", "regulatory_updates", "alerts"];
    const channels = tables.map((table) =>
      supabase
        .channel(`si:kpi:${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => queryClient.invalidateQueries({ queryKey: queryKeys.metrics })
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") setLiveCount((n) => n + 1);
        })
    );
    return () => {
      setLiveCount(0);
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [queryClient]);
  return { ...query, live: liveCount > 0 };
}
