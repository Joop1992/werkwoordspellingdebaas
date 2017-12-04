package com.example.infrastructure;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("landing");
        registry.addViewController("/loginChoice").setViewName("loginChoice");
        registry.addViewController("/loginStudent").setViewName("loginStudent");
        registry.addViewController("/loginTeacher").setViewName("loginTeacher");
        registry.addViewController("/contact").setViewName("contact");
        registry.addViewController("/login").setViewName("login");
        registry.addViewController("/excercises").setViewName("excercises");
        registry.addViewController("/createLesson").setViewName("createLesson");
        registry.addViewController("/butler").setViewName("butler");
        registry.addViewController("/landing").setViewName("landing");
    }

}