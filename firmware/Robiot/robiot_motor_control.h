/*
 * robiot_motor_control.h
 *
 *  Created on: Dec 10, 2020
 *      Author: lu
 */
#include "stdio.h"
#include "stdint.h"
#include "stm32l475xx.h"
#include "stm32l4xx_hal.h"
#include "stm32l4xx_hal_gpio.h"

/* Unsure of which wheel is which. Need to investigate */
#define ROBOT_LM_ENABLE_GPIO_PORT  GPIOA
#define ROBOT_LM_ENABLE_GPIO_PIN   GPIO_PIN_2 /* D10 */
#define ROBOT_LM_BACK_GPIO_PORT    GPIOA
#define ROBOT_LM_BACK_GPIO_PIN     GPIO_PIN_15 /* D9 */
#define ROBOT_LM_FORWARD_GPIO_PORT GPIOB
#define ROBOT_LM_FORWARD_GPIO_PIN  GPIO_PIN_2  /* D8 */
#define ROBOT_RM_BACK_GPIO_PORT    GPIOA
#define ROBOT_RM_BACK_GPIO_PIN     GPIO_PIN_4  /* D7 */
#define ROBOT_RM_FORWARD_GPIO_PORT GPIOB
#define ROBOT_RM_FORWARD_GPIO_PIN  GPIO_PIN_1  /* D6 */
#define ROBOT_RM_ENABLE_GPIO_PORT  GPIOB
#define ROBOT_RM_ENABLE_GPIO_PIN   GPIO_PIN_4  /* D5 */

#define ROBOT_ENCODER_GPIO_PORT    GPIOD
#define ROBOT_ENCODER_GPIO_PIN     GPIO_PIN_14 /* D2 */

//int Left_motor_back=9;
//int Left_motor_go=8;
//int Right_motor_go=6;
//int Right_motor_back=7;
//int Right_motor_en=5;
//int Left_motor_en=10;

#define TIM_CHANNEL                      0x00000008U   

#define WHEELn ((uint8_t)1)

typedef enum {
    LINEAR,
    ROTATION,
    STOP,
    RESET_ROBOT
} cmd_TypeDef;

typedef enum {
  FL_WHEEL = 0U, /* Not powering motor */
  FR_WHEEL = 1U, /* Left side control */
  BL_WHEEL = 2U, /* Not powering motor */
  BR_WHEEL = 3U  /* Right side control */
} Wheel_TypeDef;

typedef enum {
  LS_MOTORS  = 0U, /* Left side control */
  RS_MOTORS  = 1U, /* Right side control */
  ALL_MOTORS = 2U
} Motorside_TypeDef;

typedef enum {
  ADVANCE    = 0U,
  REVERSE    = 1U,
  CLOCKWISE  = 2U,
  CCLOCKWISE = 3U
} Direction_TypeDef;

typedef struct robiot_mc_hal {
    int front_left_wheel;
    int front_right_wheel; 
    int back_left_wheel;
    int back_right_wheel;
} robiot_mc_hal_t ;

typedef struct robiot_mc_cmd {
    cmd_TypeDef cmd_type;
    Direction_TypeDef direction;
    int job_id;
    int orientation;
    int distance;
    int travel_speed;
} robiot_mc_cmd_t;

typedef struct robiot_mc {
    robiot_mc_hal_t* hal;
    TIM_HandleTypeDef htim;
    robiot_mc_cmd_t cmd; /* Can be made into array if qeue is added */
    bool job_complete;
} robiot_mc_t;

/* Public function prototypes -----------------------------------------------*/
int robiot_motor_control_init(robiot_mc_t* robiot_mc);
void encoder_isr(void);
int robiot_motor_control_process_cmd(robiot_mc_t robiot_mc, robiot_mc_cmd_t cmd);

/**
  * @brief  Turns selected Wheel motor on.
  * @param  Wheel WHEEL to be set on
  *          This parameter can be one of the following values:
  */
int32_t robiot_turn_on_motor(Wheel_TypeDef Wheel);

/**
  * @brief  Turns selected Wheel motor off.
  * @param  Wheel WHEEL to be set on
  *          This parameter can be one of the following values:
  */
int32_t robiot_turn_off_motor(Wheel_TypeDef Wheel);

int32_t robiot_turn_on_motors(Motorside_TypeDef Motorside);

int32_t robiot_turn_off_motors(Motorside_TypeDef Motorside);

int32_t robiot_advance_motors(Motorside_TypeDef Motorside);

int32_t robiot_reverse_motors(Motorside_TypeDef Motorside);

/**
  * @brief  Prepare robot to advance.
  * @param  Wheel WHEEL to be set on
  *          This parameter can be one of the following values:
  */
int32_t robiot_set_direction(Direction_TypeDef Direction);

void robiot_motor_control_set_pwm(TIM_HandleTypeDef timer, uint32_t channel, uint16_t period, uint16_t pulse);
void robiot_motor_control_start_pwm(TIM_HandleTypeDef timer, uint32_t channel, uint16_t period, uint16_t pulse);
void robiot_motor_control_stop_pwm(TIM_HandleTypeDef timer, uint32_t channel, uint16_t period, uint16_t pulse);
