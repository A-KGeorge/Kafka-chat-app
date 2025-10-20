"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import axios from "axios";
import { CHAT_GROUP_USERS_URL } from "@/lib/apiEndPoints";
import { toast } from "sonner";

export default function ChatUserDialog({
  open,
  setOpen,
  group,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group: ChatGroupType;
}) {
  const params = useParams();
  const [state, setState] = useState({
    name: "",
    passcode: "",
  });

  useEffect(() => {
    const data = localStorage.getItem(params["id"] as string);
    console.log(data);
    if (data && data !== "undefined") {
      try {
        const jsonData = JSON.parse(data);
        if (jsonData?.name && jsonData?.group_id) {
          setOpen(false);
        }
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
        // Clean up invalid data
        localStorage.removeItem(params["id"] as string);
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // First validate passcode
    if (group.passcode != state.passcode) {
      toast.error("Please enter correct passcode!");
      return;
    }

    // Then check if user data exists in localStorage
    const localData = localStorage.getItem(params["id"] as string);
    if (!localData) {
      try {
        const { data } = await axios.post(CHAT_GROUP_USERS_URL, {
          name: state.name,
          group_id: params["id"] as string,
        });

        // Validate response data before storing
        if (data?.data) {
          localStorage.setItem(
            params["id"] as string,
            JSON.stringify(data.data)
          );
          setOpen(false);
        } else {
          console.error("Invalid API response:", data);
          toast.error("Invalid response from server!");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Something went wrong.please try again!");
      }
    } else {
      // User already exists in localStorage
      setOpen(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Name and Passcode</DialogTitle>
          <DialogDescription>
            Add your name and passcode to join in room
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <Input
              placeholder="Enter your name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
            />
          </div>
          <div className="mt-2">
            <Input
              placeholder="Enter your passcode"
              value={state.passcode}
              onChange={(e) => setState({ ...state, passcode: e.target.value })}
            />
          </div>
          <div className="mt-2">
            <Button className="w-full">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
