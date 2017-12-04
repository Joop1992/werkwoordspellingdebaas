package com.example.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.domain.Action;
import com.example.domain.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Subject findByUuid(String uuid);
}
