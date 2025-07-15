package com.moove.service;

import com.moove.entity.Booking;
import com.moove.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;

    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    public Booking getById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

    public void cancel(Long id) {
        Booking booking = getById(id);
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }
}