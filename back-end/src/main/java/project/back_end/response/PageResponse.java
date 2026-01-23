package project.back_end.response;

import java.util.List;

public record PageResponse<T>(
        List<T> data,
        int currentPage,
        int totalPages,
        long totalItems
) {
}
