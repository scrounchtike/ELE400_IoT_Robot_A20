################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../makefile.init

RM := rm -rf

# All of the sources participating in the build are defined here
-include sources.mk
-include SW4STM32/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/umqtt/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/serializer/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/parson/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/c-utility/adapters/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/c-utility/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/c-provisioning_client/adapters/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/c-provisioning_client/RIoT/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/c-provisioning_client/DICE/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/c-provisioning_client/subdir.mk
-include Middlewares/Third_Party/azure-iot-sdk-c/c-iothub_client/subdir.mk
-include Middlewares/Third_Party/MbedTLS/subdir.mk
-include Middlewares/ST/STM32_Connect_Library/services/subdir.mk
-include Middlewares/ST/STM32_Connect_Library/netif/subdir.mk
-include Middlewares/ST/STM32_Connect_Library/core/subdir.mk
-include Drivers/STM32L4xx_HAL_Driver/subdir.mk
-include Drivers/CMSIS/subdir.mk
-include Drivers/BSP/Components/vl53l0x/subdir.mk
-include Drivers/BSP/Components/es_wifi/subdir.mk
-include Drivers/BSP/Components/LSM6DSL/subdir.mk
-include Drivers/BSP/Components/LPS22HB/subdir.mk
-include Drivers/BSP/Components/LIS3MDL/subdir.mk
-include Drivers/BSP/Components/HTS221/subdir.mk
-include Drivers/BSP/B-L475E-IOT01/subdir.mk
-include Application/Utils/subdir.mk
-include Application/User/subdir.mk
-include Application/Time/subdir.mk
-include Application/Azure/subdir.mk
-include subdir.mk
-include objects.mk

ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(S_DEPS)),)
-include $(S_DEPS)
endif
ifneq ($(strip $(S_UPPER_DEPS)),)
-include $(S_UPPER_DEPS)
endif
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
endif

-include ../makefile.defs

BUILD_ARTIFACT_NAME := B-L475E-IOT01_Azure
BUILD_ARTIFACT_EXTENSION := elf
BUILD_ARTIFACT_PREFIX := 
BUILD_ARTIFACT := $(BUILD_ARTIFACT_PREFIX)$(BUILD_ARTIFACT_NAME).$(BUILD_ARTIFACT_EXTENSION)

# Add inputs and outputs from these tool invocations to the build variables 
EXECUTABLES += \
B-L475E-IOT01_Azure.elf \

SIZE_OUTPUT += \
default.size.stdout \

OBJDUMP_LIST += \
B-L475E-IOT01_Azure.list \

OBJCOPY_BIN += \
B-L475E-IOT01_Azure.bin \


# All Target
all: main-build

# Main-build Target
main-build: B-L475E-IOT01_Azure.elf secondary-outputs

# Tool invocations
B-L475E-IOT01_Azure.elf: $(OBJS) $(USER_OBJS) ../STM32L475VGTx_FLASH_NOSBSFU.ld
	arm-none-eabi-gcc -o "B-L475E-IOT01_Azure.elf" @"objects.list" $(USER_OBJS) $(LIBS) -mcpu=cortex-m4 -T"../STM32L475VGTx_FLASH_NOSBSFU.ld" --specs=nosys.specs -Wl,-Map="B-L475E-IOT01_Azure.map" -Wl,--gc-sections -static --specs=nano.specs -mfpu=fpv4-sp-d16 -mfloat-abi=hard -mthumb -u _printf_float -Wl,--start-group -lc -lm -Wl,--end-group
	@echo 'Finished building target: $@'
	@echo ' '

default.size.stdout: $(EXECUTABLES)
	arm-none-eabi-size  $(EXECUTABLES)
	@echo 'Finished building: $@'
	@echo ' '

B-L475E-IOT01_Azure.list: $(EXECUTABLES)
	arm-none-eabi-objdump -h -S $(EXECUTABLES) > "B-L475E-IOT01_Azure.list"
	@echo 'Finished building: $@'
	@echo ' '

B-L475E-IOT01_Azure.bin: $(EXECUTABLES)
	arm-none-eabi-objcopy  -O binary $(EXECUTABLES) "B-L475E-IOT01_Azure.bin"
	@echo 'Finished building: $@'
	@echo ' '

# Other Targets
clean:
	-$(RM) *
	-@echo ' '

secondary-outputs: $(SIZE_OUTPUT) $(OBJDUMP_LIST) $(OBJCOPY_BIN)

fail-specified-linker-script-missing:
	@echo 'Error: Cannot find the specified linker script. Check the linker settings in the build configuration.'
	@exit 2

warn-no-linker-script-specified:
	@echo 'Warning: No linker script specified. Check the linker settings in the build configuration.'

.PHONY: all clean dependents fail-specified-linker-script-missing warn-no-linker-script-specified
.SECONDARY:

-include ../makefile.targets
