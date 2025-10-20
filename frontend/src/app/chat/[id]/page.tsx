import ChatBase from "@/components/chat/ChatBase";
import { fetchChats } from "@/fetch/chatsFetch";
import { fetchChatGroup, fetchChatUsers } from "@/fetch/groupFetch";
import { notFound } from "next/navigation";

export default async function chat({ params }: { params: { id: string } }) {
  const awaitedParams = await params; // Await params before using

  if (awaitedParams.id.length !== 36) {
    return notFound();
  }
  const group: ChatGroupType | null = await fetchChatGroup(awaitedParams.id);
  if (group === null) {
    return notFound();
  }
  const users: Array<ChatGroupUserType> | [] = await fetchChatUsers(
    awaitedParams.id
  );
  const chats: Array<MessageType> | [] = await fetchChats(awaitedParams.id);
  return (
    <div>
      <ChatBase group={group} users={users} oldMessages={chats} />
    </div>
  );
}
