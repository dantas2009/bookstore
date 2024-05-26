package com.dantas2009.bookstore.auth.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dantas2009.bookstore.auth.models.Device;

public interface DeviceRepository extends JpaRepository<Device, Integer> {

    @Query(value = """
            select d from Device d
            inner join d.user u
            where u.id = :id and (d.revoked = false)
            """)
    List<Device> findAllValidDeviceByUser(Integer id);
}