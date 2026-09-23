package com.informubbconfig.iswspring.app1.springboot_applications.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}