package com.example.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.domain.Action;
import com.example.domain.Question;
import com.example.domain.Subject;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    Question findById(Long id);
    List<Question> findBySubject(Subject subject);
    List<Question> findBySubjectAndUuid(Subject subject, String uuid);
}
