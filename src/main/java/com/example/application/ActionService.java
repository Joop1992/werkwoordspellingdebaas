package com.example.application;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import com.example.domain.Action;
import com.example.domain.ExecutionType;
import com.example.interfaces.ActionRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ActionService {

    @Autowired
    private ActionRepository actionRepository;

    public Action findReferencedAction(String actionUuid) {
        return actionRepository.findByUuid(actionUuid);
    }

    public String saveAction(@RequestParam(value = "an") String actionName, @RequestParam(value = "et") String
            exectutionType, @RequestParam(value = "resp") String response, @RequestParam(value = "dep") String
            domoticzExecutionPath) {
        log.info("Processing action: " + actionName);
        String uuid = UUID.randomUUID().toString();
        Action newAction = Action.builder()
                .uuid(uuid)
                .actionName(actionName)
                .executionType(ExecutionType.valueOf(exectutionType))
                .response(response)
                .domoticzExecutionPath(domoticzExecutionPath)
                .build();
        log.info("Saving action %s", actionName);
        actionRepository.save(newAction);
        return uuid;
    }
}
