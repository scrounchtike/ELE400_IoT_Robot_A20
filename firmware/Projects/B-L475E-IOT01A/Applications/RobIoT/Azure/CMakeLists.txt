cmake_minimum_required(VERSION 3.17)
project(Azure C)

set(CMAKE_C_STANDARD 11)

include_directories(Inc)

add_executable(Azure
        Inc/es_wifi_conf.h
        Inc/flash.h
        Inc/main.h
        Inc/mbedtls_config.h
        Inc/mbedtls_entropy.h
        Inc/net_conf.h
        Inc/sensors_data.h
        Inc/stm32l475e_iot01_conf.h
        Inc/stm32l4xx_hal_conf.h
        Inc/stm32l4xx_it.h
        Inc/vl53l0x_platform.h
        Inc/vl53l0x_proximity.h
        Src/flash_l4.c
        Src/main.c
        Src/mbedtls_entropy.c
        Src/net_conf.c
        Src/sensors_data.c
        Src/set_credentials.c
        Src/stm32l4xx_hal_msp.c
        Src/stm32l4xx_it.c
        Src/system_stm32l4xx.c
        Src/vl53l0x_platform.c
        Src/vl53l0x_proximity.c
        SW4STM32/syscalls.c)
