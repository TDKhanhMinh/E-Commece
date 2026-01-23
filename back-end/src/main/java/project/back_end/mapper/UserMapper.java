package project.back_end.mapper;

import org.mapstruct.Mapper;
import project.back_end.dto.user.UserDTO;
import project.back_end.entity.User;
import project.back_end.response.UserResponse.UserResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {
    default User.Role mapRole(String role) {
        return role != null ? User.Role.valueOf(role.toUpperCase()) : null;
    }

    UserDTO toUserDTO(User user);

    UserResponse toUserResponse(User user);
}

