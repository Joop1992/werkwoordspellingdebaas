package com.example.interfaces;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.application.CommandService;
import com.example.application.ActionService;
import com.example.domain.Command;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(value = "/")
@Slf4j
public class CommandController {

    @Autowired
    private CommandService commandService;
    @Autowired
    private ActionService actionService;

    @RequestMapping(value = "/processCommand")
    public String processCommand(@RequestParam(value="command") String command) {
        log.info("Processing command: " + command);
        Command mostLikely = commandService.attemptCommandRecognition(command);
        return commandService.getReturnValue(mostLikely);
    }

    @RequestMapping(value = "/saveCommand")
    public String saveCommand(@RequestParam(value = "command") String command, @RequestParam(value = "actionUuid")
            String actionUuid){
        String result = commandService.saveCommand(command, actionService.findReferencedAction(actionUuid));
        log.info("Saving command: " + command);
        return result;
    }

}
