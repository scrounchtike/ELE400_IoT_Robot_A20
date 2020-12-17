/**
  ******************************************************************************
  * @file    test_sensors.h
  * @author  MCD Application Team
  * @brief   Header for test_sensors.c module
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2017 STMicroelectronics International N.V. 
  * All rights reserved.</center></h2>
  *
  * This software component is licensed by ST under Ultimate Liberty license
  * SLA0044, the "License"; You may not use this file except in compliance with
  * the License. You may obtain a copy of the License at:
  *                             www.st.com/SLA0044
  *
  ******************************************************************************
  */

/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef TEST_SENSORS_H
#define TEST_SENSORS_H

#ifdef __cplusplus
 extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/

/* Exported types ------------------------------------------------------------*/
/* Exported constants --------------------------------------------------------*/
/* External variables --------------------------------------------------------*/
/* Exported macros -----------------------------------------------------------*/
/* Exported functions ------------------------------------------------------- */
int test_sensors();
int test_thermometer();
int test_hygrometer();
int test_barometer();
int test_magnetometer();
int test_gyrometer();
int test_accelerometer();
int test_tof();

#ifdef __cplusplus
}
#endif

#endif /* TEST_SENSORS_H */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/