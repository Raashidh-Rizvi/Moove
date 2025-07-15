package com.moove.controller;

import com.moove.entity.Message;
import com.moove.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/conversation")
    public List<Message> getConversation(
            @RequestParam Long senderId,
            @RequestParam Long receiverId
    ) {
        return messageService.getConversation(senderId, receiverId);
    }

    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        return messageService.save(message);
    }
}
