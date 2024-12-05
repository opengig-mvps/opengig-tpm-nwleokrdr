"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoaderCircleIcon } from "lucide-react";
import api from "@/lib/api";

const JiraIntegration: React.FC = () => {
  const { data: session } = useSession();
  const [integrationStatus, setIntegrationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      jiraEmail: "",
      jiraApiToken: "",
    },
  });

  useEffect(() => {
    const fetchIntegrationStatus = async () => {
      try {
        const response = await api.get(`/api/admin/jira-integration/status`);
        setIntegrationStatus(response?.data?.status);
      } catch (error) {
        console.error("Failed to fetch integration status", error);
      }
    };
    fetchIntegrationStatus();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const payload = {
        email: data?.jiraEmail,
        apiToken: data?.jiraApiToken,
      };

      const response = await api.post(
        `/api/admin/jira-integration/connect`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Jira account connected successfully!");
        setIntegrationStatus("Connected");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Failed to connect Jira account.");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectJira = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/api/admin/jira-integration/disconnect`);

      if (response?.data?.success) {
        toast.success("Jira account disconnected successfully!");
        setIntegrationStatus("Disconnected");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Failed to disconnect Jira account.");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Jira Integration</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Connect Jira Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jiraEmail">Jira Email</Label>
              <Input
                {...register("jiraEmail", { required: "Jira email is required" })}
                placeholder="Enter your Jira email"
              />
              {errors?.jiraEmail && (
                <p className="text-red-500 text-sm">{errors?.jiraEmail?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jiraApiToken">Jira API Token</Label>
              <Input
                {...register("jiraApiToken", { required: "Jira API token is required" })}
                placeholder="Enter your Jira API token"
              />
              {errors?.jiraApiToken && (
                <p className="text-red-500 text-sm">{errors?.jiraApiToken?.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {integrationStatus && (
        <div className="mt-6">
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Integration Status</AlertDialogTitle>
                <AlertDialogDescription>
                  Current status: {integrationStatus}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                {integrationStatus === "Connected" && (
                  <AlertDialogAction onClick={disconnectJira}>
                    Disconnect
                  </AlertDialogAction>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default JiraIntegration;