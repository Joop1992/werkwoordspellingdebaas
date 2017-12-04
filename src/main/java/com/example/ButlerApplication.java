package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.example.application.InitDatabaseService;
import com.example.interfaces.SubjectRepository;

@SpringBootApplication
public class ButlerApplication {

	public static void main(String[] args) {

		SpringApplication.run(ButlerApplication.class, args);
	}
}
