package com.erp.controller;
import com.erp.entity.Supplier;
import com.erp.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {
    @Autowired private SupplierRepository repository;
    @GetMapping public List<Supplier> getAll() { return repository.findAll(); }
    @PostMapping public Supplier create(@RequestBody Supplier supplier) { return repository.save(supplier); }
    @PutMapping("/{id}") public ResponseEntity<Supplier> update(@PathVariable Long id, @RequestBody Supplier s) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        s.setId(id); return ResponseEntity.ok(repository.save(s));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) { repository.deleteById(id); return ResponseEntity.ok().build(); }
        return ResponseEntity.notFound().build();
    }
}
