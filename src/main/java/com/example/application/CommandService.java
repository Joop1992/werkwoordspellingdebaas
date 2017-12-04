package com.example.application;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.domain.Action;
import com.example.domain.Command;
import com.example.domain.ExecutionType;
import com.example.interfaces.CommandRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CommandService {

    private static final String COMMAND_EXECUTED = "Command executed";
    private static final String COMMAND_NOT_KNOWN = "Command not known";

    @Autowired
    private CommandRepository commandRepository;

    public String saveCommand(String command, Action action){
        log.info("Saving new command: " + command);
        try {
            Command newCommand = Command.builder()
                    .uuid(UUID.randomUUID().toString())
                    .commandContent(command)
                    .wordOrder(determineWordOrder(command))
                    .keyWords(determineKeyWords(command))
                    .action(action)
                    .build();
            commandRepository.save(newCommand);
            return "Command and response saved";
        }catch(Exception e){
            return "Failed to save command or response";
        }
    }

    private List<String> determineKeyWords(String command) {
        List<Command> knownCommands = commandRepository.findAll();
        List<String> knownCommandsTotal = new ArrayList<>();
        List<String> wordsInCommand = Arrays.asList(command.split(" "));
        List<String> keywords = new ArrayList<>();
        for(Command knownCommand : knownCommands){
            knownCommandsTotal.addAll(Arrays.asList(knownCommand.getCommandContent().split(" ")));
        }
        for(String wordInCommand : wordsInCommand){
            if(!knownCommandsTotal.contains(wordInCommand)){
                log.info("Added keyword: " + wordInCommand + " to command: " + command);
                keywords.add(wordInCommand);
            }
        }
        return keywords;
    }

    private List<String> determineWordOrder(String command) {
        List<String> wordOrder = new ArrayList<>();
        List<String> wordsInCommand = Arrays.asList(command.split(" "));
        for(int i = 0; i < wordsInCommand.size() - 1; i++){
            log.info("Added pair: " + wordsInCommand.get(i) + " " + wordsInCommand.get(i+1) + " to: " + command);
            wordOrder.add(wordsInCommand.get(i) + " " + wordsInCommand.get(i+1));
        }
        return wordOrder;
    }

    public Command attemptCommandRecognition(String receivedCommand){
        HashMap<Command, BigDecimal> commandsToBeComparedAndScored = initializeCommandComparingHashMap();
        commandsToBeComparedAndScored = findMostLikelyWhenComparingToKnownCommands(commandsToBeComparedAndScored,
                receivedCommand);
        commandsToBeComparedAndScored = findMostLikelyWhenComparingWordOrder(commandsToBeComparedAndScored,
                receivedCommand);
        commandsToBeComparedAndScored = findMostLikelyWhenComparingKeyWords(commandsToBeComparedAndScored,
                receivedCommand);
        Command commandToBeExecuted = determineMostLikelyCommand(commandsToBeComparedAndScored);
        return commandToBeExecuted;
    }

    private HashMap<Command, BigDecimal> initializeCommandComparingHashMap() {
        List<Command> knownCommands = commandRepository.findAll();
        HashMap<Command, BigDecimal> commandsToBeComparedAndScored = new HashMap<>();
        for(Command command : knownCommands){
            commandsToBeComparedAndScored.put(command, BigDecimal.ZERO);
        }
        return commandsToBeComparedAndScored;
    }

    public String getReturnValue(Command mostLikely) {
        if(ableToDetermine(mostLikely)){
            ExecutionType executionType = mostLikely.getAction().getExecutionType();
            String response = mostLikely.getAction().getResponse();
            if(executionType == ExecutionType.SPEAK){
                log.info("speak: " + response);
                return "speak: " + response;
            }else if(executionType == ExecutionType.DOMOTICZ){
                executeCommand(mostLikely);
                return COMMAND_EXECUTED;
            }else if(executionType == ExecutionType.SPEAKANDDOMOTICZ){
                executeCommand(mostLikely);
                log.info("speak: " + response);
                return "speak: " + response;
            }
        }else{
            return COMMAND_NOT_KNOWN;
        }
        return COMMAND_NOT_KNOWN;
    }

    private HashMap<Command, BigDecimal> findMostLikelyWhenComparingToKnownCommands(HashMap<Command, BigDecimal>
        commandsToBeComparedAndScored, String command) {
        HashMap<Command, BigDecimal> commandsToBeComparedAndScoredResults = new HashMap<>();
        for (Map.Entry<Command, BigDecimal> entry : commandsToBeComparedAndScored.entrySet())
        {
            if(entry.getKey().getCommandContent().equals(command)){
                log.info("Command found while comparing to known commands");
                commandsToBeComparedAndScoredResults.put(entry.getKey(), new BigDecimal(100));
            }else{
                commandsToBeComparedAndScoredResults.put(entry.getKey(), BigDecimal.ZERO);
            }
        }
        return commandsToBeComparedAndScoredResults;
    }

    private HashMap<Command, BigDecimal> findMostLikelyWhenComparingWordOrder(HashMap<Command, BigDecimal> commandsToBeComparedAndScored,
            String receivedCommand) {
        return commandsToBeComparedAndScored;
    }

    private HashMap<Command, BigDecimal> findMostLikelyWhenComparingKeyWords(HashMap<Command, BigDecimal> commandsToBeComparedAndScored,
            String receivedCommand) {
        HashMap<Command, BigDecimal> commandsToBeComparedAndScoredResults = new HashMap<>();
        BigDecimal score = BigDecimal.ZERO;
        for (Map.Entry<Command, BigDecimal> entry : commandsToBeComparedAndScored.entrySet())
        {
            for(String word : receivedCommand.split(" ")){
                String commandContent = entry.getKey().getCommandContent();
                log.info("Checking if : " + commandContent + " contains: " + word );
                if(commandContent.contains(" " + word)){
                    score = score.add(BigDecimal.TEN);
                    log.info(commandContent + " score: " + score);
                }
            }
            commandsToBeComparedAndScoredResults.put(entry.getKey(), entry.getValue().add(score));
            score = BigDecimal.ZERO;
        }
        return commandsToBeComparedAndScoredResults;
    }

    private Command determineMostLikelyCommand(HashMap<Command, BigDecimal> commandsToBeComparedAndScored) {
        Command mostLikely = null;
        BigDecimal highestScore = BigDecimal.ZERO;
        for (Map.Entry<Command, BigDecimal> entry : commandsToBeComparedAndScored.entrySet())
        {
            log.info("Comparing: " + entry.getValue() + " to " + highestScore);
            if(entry.getValue().compareTo(highestScore) > 0){
                log.info("Was greater");
                highestScore = entry.getValue();
                mostLikely = entry.getKey();
            }
        }
        return mostLikely;
    }

    public void executeCommand(Command commandToBeExecuted) {
        log.info("Executing command: " + commandToBeExecuted.getCommandContent());
    }

    public boolean ableToDetermine(Command mostLikely) {
        return mostLikely != null;
    }
}
