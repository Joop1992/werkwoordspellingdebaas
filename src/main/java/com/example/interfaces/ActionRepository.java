package com.example.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.domain.Action;

@Repository
public interface ActionRepository extends JpaRepository<Action, Long> {

    Action findByUuid(String uuid);
}
