package com.example.interfaces;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.application.ActionService;
import com.example.application.InitDatabaseService;
import com.example.domain.Action;
import com.example.domain.ExecutionType;
import com.example.domain.Question;
import com.example.domain.Subject;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(value = "/question")
@Slf4j
public class QuestionController {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private InitDatabaseService initDatabaseService;

    @RequestMapping(value = "/saveQuestion")
    public List<Question> saveQuestion(@RequestParam(value = "sid") String subjectId, @RequestParam(value = "uuid")
            String uuid, @RequestParam(value = "id")
            String
            id,
            @RequestParam(value = "question") String question, @RequestParam(value = "answer") String answer,
            @RequestParam(value = "positiveFeedback") String positiveFeedback, @RequestParam(value ="negativeFeedback")
            String negativeFeedback){
        initDatabaseService.initialize();
        Subject subject = subjectRepository.findByUuid(subjectId);
        Question newQuestion = Question.builder()
                .uuid(uuid)
                .question(question)
                .answer(answer)
                .positiveFeedback(positiveFeedback)
                .negativeFeedback(negativeFeedback)
                .subject(subject)
                .build();
        questionRepository.save(newQuestion);
        List<Question> questions = questionRepository.findBySubjectAndUuid(subject, uuid);
        System.out.println("Question added: " + question);
        return questions;
    }

    @RequestMapping(value = "/deleteQuestion")
    public List<Question> deleteQuestion(@RequestParam(value = "sid") String subjectId, @RequestParam(value = "uuid")
            String uuid, @RequestParam(value = "id")
            String id){
        questionRepository.delete((Long.parseLong(id)));
        Subject subject = subjectRepository.findByUuid(subjectId);
        List<Question> questions = questionRepository.findBySubjectAndUuid(subject, uuid);
        return questions;
    }

    @RequestMapping(value = "/getQuestions")
    public List<Question> getQuestions(@RequestParam(value = "sid") String subjectId, @RequestParam(value = "uuid")
            String
            uuid){
        Subject subject = subjectRepository.findByUuid(subjectId);
        List<Question> questions = questionRepository.findBySubjectAndUuid(subject, uuid);
        return questions;
    }

    @RequestMapping(value = "/getQuestion")
    public Question getQuestion(@RequestParam(value = "id")
            String id){
        Question q = questionRepository.findById(Long.parseLong(id));
        return q;
    }

    @RequestMapping(value = "/editQuestion")
    public List<Question> editQuestion(@RequestParam(value = "sid") String subjectId, @RequestParam(value = "uuid")
            String uuid, @RequestParam(value = "id")
            String id, @RequestParam(value = "question")
            String question, @RequestParam(value = "answer") String answer,
            @RequestParam(value = "positiveFeedback") String positiveFeedback, @RequestParam(value ="negativeFeedback")
            String negativeFeedback){
        Question updateQuestion = questionRepository.findById(Long.parseLong(id));
        Subject subject = subjectRepository.findByUuid(subjectId);
        updateQuestion.setQuestion(question);
        updateQuestion.setAnswer(answer);
        updateQuestion.setPositiveFeedback(positiveFeedback);
        updateQuestion.setNegativeFeedback(negativeFeedback);
        questionRepository.save(updateQuestion);
        List<Question> questions = questionRepository.findBySubjectAndUuid(subject, uuid);
        return questions;
    }
}
