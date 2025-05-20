
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface HealthRecord {
  id: string;
  user_id: string;
  calculator_type: string;
  result: any;
  created_at: string;
}

export function useHealthRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      if (!user) {
        setRecords([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("health_records")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching health records:", error);
          return;
        }

        setRecords(data || []);
      } catch (error) {
        console.error("Error fetching health records:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, [user]);

  const saveHealthRecord = async (
    calculator_type: string,
    result: any
  ) => {
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      const { data, error } = await supabase
        .from("health_records")
        .insert({
          user_id: user.id,
          calculator_type,
          result,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error };
      }

      setRecords([data, ...records]);
      return { success: true, data };
    } catch (error) {
      console.error("Error saving health record:", error);
      return { success: false, error };
    }
  };

  return {
    records,
    loading,
    saveHealthRecord,
  };
}
