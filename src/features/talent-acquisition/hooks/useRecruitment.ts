"use client";

import { useCallback, useEffect, useState } from "react";

import type { JobPosting } from "../types";

export function useRecruitment() {
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { getJobPostings } = await import("../services/recruitmentService");
      const data = await getJobPostings();
      setPostings(data);
    } catch {
      setError("Unable to load job postings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPostings();
  }, [fetchPostings]);

  return { postings, isLoading, error, refetch: fetchPostings };
}
