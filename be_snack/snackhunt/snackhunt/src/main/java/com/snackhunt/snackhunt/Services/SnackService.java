package com.snackhunt.snackhunt.Services;
import org.springframework.stereotype.Service;
import com.snackhunt.snackhunt.Models.*;
import com.snackhunt.snackhunt.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@Service
public class SnackService {
    
    @Autowired
    private SnackRepository snackRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    public Snack createSnack(Snack snack) {
        snack.setId(sequenceGeneratorService.generateSequence(Snack.SEQUENCE_NAME));
        return snackRepository.save(snack);
    }

    public List<Snack> getAllSnacks() {
        return snackRepository.findAll();
    }

    public Optional<Snack> getSnackById(int id) {
        return snackRepository.findById(id);
    }

    public List<Snack> getSnacksByType(String type) {
        System.out.println("Searching for snack type: " + type);
        List<Snack> snack = snackRepository.findByType(type);
        return snack;
    }

    public Snack updateSnack(int id, Snack snackDetails){
        return snackRepository.findById(id).map(snack-> {
            snack.setName(snackDetails.getName());
            snack.setPrice(snackDetails.getPrice());
            snack.setImage(snackDetails.getImage());
            snack.setImage_URL(snackDetails.getImage_URL());
            snack.setSeller(snackDetails.getSeller());
            snack.setContact(snackDetails.getContact());
            snack.setLocation(snackDetails.getLocation());
            snack.setRating(snackDetails.getRating());
            snack.setType(snackDetails.getType());
            snack.setUserId(snackDetails.getUserId());
            return snackRepository.save(snack);
        }).orElse(null);
    }

    public boolean deleteSnack(int id){
        if (snackRepository.existsById(id)) {
            snackRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
