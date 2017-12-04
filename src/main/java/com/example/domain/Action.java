package com.example.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Action {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "uuid")
    private String uuid;

    @Column(name = "action_name")
    private String actionName;

    @Column(name = "execution_type")
    private ExecutionType executionType;

    @Column(name = "response")
    private String response;

    @Column(name = "domoticz_execution_path")
    private String domoticzExecutionPath;
}
