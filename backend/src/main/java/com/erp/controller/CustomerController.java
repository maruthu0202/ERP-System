package com.erp.controller;
import com.erp.entity.Customer;
import com.erp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {
    @Autowired private CustomerRepository repository;
    @GetMapping public List<Customer> getAll() { return repository.findAll(); }
    @PostMapping public Customer create(@RequestBody Customer customer) { return repository.save(customer); }
    @PutMapping("/{id}") public ResponseEntity<Customer> update(@PathVariable Long id, @RequestBody Customer c) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        c.setId(id); return ResponseEntity.ok(repository.save(c));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) { repository.deleteById(id); return ResponseEntity.ok().build(); }
        return ResponseEntity.notFound().build();
    }
}
