package ma.holakids.auth.dto;

import ma.holakids.user.Role;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        boolean enabled) {
}
