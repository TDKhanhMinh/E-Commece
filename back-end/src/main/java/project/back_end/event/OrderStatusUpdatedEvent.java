package project.back_end.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class OrderStatusUpdatedEvent extends ApplicationEvent {
    private Long orderId;
    private String newStatus;

    public OrderStatusUpdatedEvent(Object source, Long orderId, String newStatus) {
        super(source);
        this.orderId = orderId;
        this.newStatus = newStatus;
    }
}


