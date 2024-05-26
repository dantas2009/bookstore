package com.dantas2009.bookstore.auth.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dantas2009.bookstore.auth.models.Device;
import com.dantas2009.bookstore.auth.models.User;
import com.dantas2009.bookstore.auth.repositories.DeviceRepository;

import eu.bitwalker.useragentutils.UserAgent;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;

    public Device generateDevice(HttpServletRequest httpRequest, User user) {
        UserAgent userAgent = UserAgent.parseUserAgentString(httpRequest.getHeader("User-Agent"));
        return getOrSaveDevice(Device.builder()
                .user(user)
                .device_name(userAgent.getOperatingSystem().getDeviceType().getName())
                .device_os(userAgent.getOperatingSystem().getName())
                .browser(userAgent.getBrowser().getName())
                .ip_address(httpRequest.getRemoteAddr())
                .build());
    }

    public Device getOrSaveDevice(Device device) {
        List<Device> devices = deviceRepository.findAllValidDeviceByUser(device.getUser().getId());

        for (Device oldDevice : devices) {
            if (oldDevice.getDevice_name().equals(device.getDevice_name())
                    && oldDevice.getDevice_os().equals(device.getDevice_os())
                    && oldDevice.getBrowser().equals(device.getBrowser())) {
                return oldDevice;
            }
        }

        return deviceRepository.save(device);
    }
}
