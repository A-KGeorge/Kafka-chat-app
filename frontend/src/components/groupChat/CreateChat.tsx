"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateChatSchema,
  CreateChatSchemaType,
} from "@/validations/groupChatValidation";
import { Input } from "@/components/ui/input";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { CHAT_GROUP_URL } from "@/lib/apiEndPoints";
import { clearCache } from "@/actions/common";

export default function CreateChat({ user }: { user: CustomUser }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateChatSchemaType>({
    resolver: zodResolver(CreateChatSchema),
  });
  const onSubmit = async (payload: CreateChatSchemaType) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        CHAT_GROUP_URL,
        { ...payload, user_id: user.id },
        {
          headers: {
            Authorization: user.token,
          },
        }
      );
      if (data?.message) {
        clearCache("dashboard");
        setLoading(false);
        setOpen(false);
        toast.success("Chat group created successfully!");
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Group</Button>
        </DialogTrigger>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Create a new chat group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <Input {...register("title")} placeholder="Enter chat Title" />
              <span className="text-red-500 text-sm">
                {errors.title?.message}
              </span>
            </div>
            <div className="mt-4">
              <Input
                {...register("passcode")}
                placeholder="Enter chat Passcode"
              />
              <span className="text-red-500 text-sm">
                {errors.passcode?.message}
              </span>
            </div>
            <div className="mt-4">
              <Button className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
