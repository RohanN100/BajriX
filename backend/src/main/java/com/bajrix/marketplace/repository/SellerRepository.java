package com.bajrix.marketplace.repository;

import com.bajrix.marketplace.domain.entity.Seller;
import com.bajrix.marketplace.domain.enums.SellerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SellerRepository extends JpaRepository<Seller, UUID> {
    List<Seller> findByStatus(SellerStatus status);
}
