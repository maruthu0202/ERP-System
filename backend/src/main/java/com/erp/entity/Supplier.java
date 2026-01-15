package com.erp.entity;
import jakarta.persistence.*;
@Entity
@Table(name = "suppliers")
public class Supplier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    private String email, phone, address, gstin;
    public Supplier() {}
    public Long getId() {return id;} public void setId(Long id) {this.id = id;}
    public String getName() {return name;} public void setName(String name) {this.name = name;}
    public String getEmail() {return email;} public void setEmail(String email) {this.email = email;}
    public String getPhone() {return phone;} public void setPhone(String phone) {this.phone = phone;}
    public String getAddress() {return address;} public void setAddress(String address) {this.address = address;}
    public String getGstin() {return gstin;} public void setGstin(String gstin) {this.gstin = gstin;}
}
