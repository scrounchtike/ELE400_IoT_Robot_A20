################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
/home/lu/Projects/STM32CubeExpansion_Cloud_AZURE_V1.2.1/Drivers/BSPv2/Components/es_wifi/es_wifi.c 

OBJS += \
./Drivers/BSP/Components/es_wifi/es_wifi.o 

C_DEPS += \
./Drivers/BSP/Components/es_wifi/es_wifi.d 


# Each subdirectory must supply rules for building sources it contributes
Drivers/BSP/Components/es_wifi/es_wifi.o: /home/lu/Projects/STM32CubeExpansion_Cloud_AZURE_V1.2.1/Drivers/BSPv2/Components/es_wifi/es_wifi.c
	arm-none-eabi-gcc "$<" -mcpu=cortex-m4 -std=gnu11 -g3 -DSTM32L475xx -DUSE_HAL_DRIVER -DSENSOR '-DMBEDTLS_CONFIG_FILE=<mbedtls_config.h>' -DENABLE_IOT_INFO -DENABLE_IOT_ERROR -DENABLE_IOT_WARNING -DDONT_USE_UPLOADTOBLOB -DAZURE -DUSE_MBED_TLS -DHSM_TYPE_X509 -DHSM_TYPE_SAS_TOKEN -DUSE_PROV_MODULE '-DEINVAL=22' '-DENOMEM=12' '-DSTRINGS_C_SPRINTF_BUFFER_SIZE=512' -DUSE_WIFI -c -I../../../../../../../../Drivers/CMSIS/Device/ST/STM32L4xx/Include -I../../../../../../../../Drivers/CMSIS/Include -I../../../../../../../../Drivers/STM32L4xx_HAL_Driver/Inc -I../../../../../../../../Drivers/BSPv2/B-L475E-IOT01 -I../../../Inc -I../../../../../../../../Middlewares/ST/STM32_Connect_Library/Includes -I../../../../../../../../Middlewares/ST/STM32_Secure_Engine/Core -I../../../../../BootLoader_OSC/2_Images_SECoreBin/Inc -I../../../../../BootLoader_OSC/2_Images_SBSFU/SBSFU/App -I../../../../../BootLoader_OSC/Linker_Common/SW4STM32 -I../../../../../../../Misc_Utils/Inc -I../../../../../../../../Utilities/Time -I../../../../../../../../Utilities/CLD_utils/http_lib -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/umqtt/inc -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/iothub_client/inc -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/iothub_client/samples/STM32Cube_sample -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/provisioning_client/adapters -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/provisioning_client/inc -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/provisioning_client/deps/RIoT/Emulator/RIoT -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/provisioning_client/deps/RIoT/Emulator/DICE -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/provisioning_client/deps/RIoT/Emulator/RIoT/RIoTCrypt/include -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/c-utility/inc -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/c-utility/pal/generic -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/serializer/inc -I../../../../../../../../Middlewares/Third_Party/azure-iot-sdk-c/deps/parson -I../../../../../../../../Middlewares/Third_Party/mbedTLS/include -I../../../../../../../../Drivers/BSPv2/Components/es_wifi -I../../../../../../../../Drivers/BSPv2/Components/vl53l0x -I../../../../../BootLoader_OSC/Linker_Common -Os -ffunction-sections -Wall -fstack-usage -MMD -MP -MF"Drivers/BSP/Components/es_wifi/es_wifi.d" -MT"$@" --specs=nano.specs -mfpu=fpv4-sp-d16 -mfloat-abi=hard -mthumb -o "$@"

