package com.example.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.domain.Command;

@Repository
public interface CommandRepository extends JpaRepository<Command, Long> {

}