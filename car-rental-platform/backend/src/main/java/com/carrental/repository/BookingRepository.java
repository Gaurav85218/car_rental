package com.carrental.repository;

import com.carrental.entity.Booking;
import com.carrental.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByCarId(Long carId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusNot(
            Long carId, LocalDate endDate, LocalDate startDate, BookingStatus status);

    List<Booking> findByCarIdIn(List<Long> carIds);
    List<Booking> findByCarIdAndStatusNotIn(Long carId, List<BookingStatus> statuses);
    List<Booking> findByCarIdAndStatusNot(Long carId, BookingStatus status);

}
