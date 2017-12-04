package com.example.interfaces;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.application.ActionService;
import com.example.domain.Action;
import com.example.domain.ExecutionType;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(value = "/")
@Slf4j
public class ActionController {
    @Autowired
    private ActionService actionService;

    @RequestMapping(value = "/saveAction")
    public String saveAction(@RequestParam(value = "an") String actionName, @RequestParam(value = "et")
            String exectutionType, @RequestParam(value = "resp") String response, @RequestParam(value = "dep") String
            domoticzExecutionPath){
        return actionService.saveAction(actionName, exectutionType, response, domoticzExecutionPath);
    }
}
