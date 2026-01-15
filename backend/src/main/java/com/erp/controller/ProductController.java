package com.erp.controller;
import com.erp.entity.Product;
import com.erp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired private ProductRepository repository;
    @GetMapping public List<Product> getAll() { return repository.findAll(); }
    @PostMapping public Product create(@RequestBody Product product) { return repository.save(product); }
    @PutMapping("/{id}") public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product p) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        p.setId(id); return ResponseEntity.ok(repository.save(p));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) { repository.deleteById(id); return ResponseEntity.ok().build(); }
        return ResponseEntity.notFound().build();
    }
}
