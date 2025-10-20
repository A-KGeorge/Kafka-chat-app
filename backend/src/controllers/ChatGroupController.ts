import type { Request, Response } from "express";
import prisma from "../config/db.config.js";

class ChatGroupController {
  static async index(request: Request, response: Response) {
    try {
      const user = request.user;
      const groups = await prisma.chatGroup.findMany({
        where: { user_id: user!.id },
        orderBy: { created_at: "desc" },
      });
      return response.json({
        message: "Chat group fetched successfully.",
        data: groups,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }

  static async show(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const group = await prisma.chatGroup.findUnique({
        where: { id: id },
      });
      return response.json({
        message: "Chat group fetched successfully.",
        data: group,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }

  static async store(request: Request, response: Response) {
    try {
      const body = request.body;
      const user = request.user;
      await prisma.chatGroup.create({
        data: {
          title: body.title,
          passcode: body.passcode,
          user_id: user!.id,
        },
      });
      return response
        .status(201)
        .json({ message: "Chat group created successfully." });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }

  static async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const body = request.body;

      const group = await prisma.chatGroup.update({
        data: { title: body.title, passcode: body.passcode },
        where: { id: id },
      });
      return response.json({
        message: "Chat group updated successfully.",
        data: group,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }

  static async destroy(request: Request, response: Response) {
    try {
      const { id } = request.params;
      await prisma.chatGroup.delete({
        where: { id: id },
      });
      return response.json({
        message: "Chat group deleted successfully.",
      });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Something went wrong, please try again later." });
    }
  }
}

export default ChatGroupController;
