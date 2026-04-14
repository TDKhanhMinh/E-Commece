package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.back_end.entity.Notification;
import project.back_end.response.NotificationResponse;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "id", target = "notificationId")
    @Mapping(source = "title", target = "title")
    @Mapping(source = "type", target = "type")
    @Mapping(source = "message", target = "message")
    @Mapping(source = "isRead", target = "isRead")
    NotificationResponse toNotificationResponse(Notification notification);


    Notification toNotificationEntity(NotificationResponse response);
}
