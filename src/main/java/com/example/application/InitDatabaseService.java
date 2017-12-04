package com.example.application;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import com.example.domain.Action;
import com.example.domain.ExecutionType;
import com.example.domain.Question;
import com.example.domain.Subject;
import com.example.interfaces.ActionRepository;
import com.example.interfaces.SubjectRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class InitDatabaseService {

    @Autowired
    private SubjectRepository subjectRepository;

    public void initialize() {
        Subject subject = subjectRepository.findByUuid("pvtt");
        if(null == subject){
            Subject newSubject = Subject.builder()
                    .uuid("pvtt")
                    .subjectName("pvtt")
                    .build();
            subjectRepository.save(newSubject);
            newSubject = Subject.builder()
                    .uuid("pvvt")
                    .subjectName("pvvt")
                    .build();
            subjectRepository.save(newSubject);
            newSubject = Subject.builder()
                    .uuid("inf")
                    .subjectName("inf")
                    .build();
            subjectRepository.save(newSubject);
            newSubject = Subject.builder()
                    .uuid("vtdw")
                    .subjectName("vtdw")
                    .build();
            subjectRepository.save(newSubject);
            newSubject = Subject.builder()
                    .uuid("otdw")
                    .subjectName("otdw")
                    .build();
            subjectRepository.save(newSubject);
            newSubject = Subject.builder()
                    .uuid("gbdw")
                    .subjectName("gbdw")
                    .build();
            subjectRepository.save(newSubject);
            newSubject = Subject.builder()
                    .uuid("enww")
                    .subjectName("enww")
                    .build();
            subjectRepository.save(newSubject);
            newSubject = Subject.builder()
                    .uuid("vdbv")
                    .subjectName("vdbv")
                    .build();
            subjectRepository.save(newSubject);
            System.out.println("saving subject");
        }
    }
}
