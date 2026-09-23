package ma.holakids.user;

import java.util.List;

import ma.holakids.auth.dto.UserResponse;
import ma.holakids.common.ResourceNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserResponse> list() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(
                        user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.isEnabled()))
                .toList();
    }

    @PatchMapping("/{id}/toggle-enabled")
    public UserResponse toggleEnabled(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable."));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        return new UserResponse(
                user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.isEnabled());
    }
}
