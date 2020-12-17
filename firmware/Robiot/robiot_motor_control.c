/*
 * robiot_motor_control.c
 *
 *  Created on: Dec 10, 2020
 *      Author: lu
 */

/* Includes ------------------------------------------------------------------*/
#include <stdio.h>
#include <stdlib.h> 
#include "robiot_motor_control.h"

/* Private defines -----------------------------------------------------------*/
#define NUMBER_OF_WHEELS  4
#define ROBIOT_PWM_PERIOD 255

/* Private function prototypes -----------------------------------------------*/
int robiot_motor_control_wheel_init(Wheel_TypeDef Wheel);
int robiot_motor_control_encoder_init(void);
int robiot_motor_control_hal_init(void);

/* Public functions */
int robiot_motor_control_init(robiot_mc_t* robiot_mc)
{
    robiot_motor_control_hal_init();

    return 1;
}

int32_t robiot_turn_on_motors(Motorside_TypeDef Motorside)
{
    switch(Motorside) {
        case LS_MOTORS:
            HAL_GPIO_WritePin(ROBOT_LM_ENABLE_GPIO_PORT, ROBOT_LM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            break;
        case RS_MOTORS:
            HAL_GPIO_WritePin(ROBOT_RM_ENABLE_GPIO_PORT, ROBOT_RM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            break;
        case ALL_MOTORS:
            HAL_GPIO_WritePin(ROBOT_LM_ENABLE_GPIO_PORT, ROBOT_LM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_RM_ENABLE_GPIO_PORT, ROBOT_RM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            break;
    }

    return 0;
}

int32_t robiot_turn_off_motors(Motorside_TypeDef Motorside)
{
    switch(Motorside) {
        case LS_MOTORS:
            HAL_GPIO_WritePin(ROBOT_LM_ENABLE_GPIO_PORT, ROBOT_LM_ENABLE_GPIO_PIN, GPIO_PIN_RESET);
        case RS_MOTORS:
            HAL_GPIO_WritePin(ROBOT_RM_ENABLE_GPIO_PORT, ROBOT_RM_ENABLE_GPIO_PIN, GPIO_PIN_RESET);
        case ALL_MOTORS:
            HAL_GPIO_WritePin(ROBOT_LM_ENABLE_GPIO_PORT, ROBOT_LM_ENABLE_GPIO_PIN, GPIO_PIN_RESET);
            HAL_GPIO_WritePin(ROBOT_RM_ENABLE_GPIO_PORT, ROBOT_RM_ENABLE_GPIO_PIN, GPIO_PIN_RESET);
    }

    return 0;
}

int32_t robiot_advance_motors(Motorside_TypeDef Motorside)
{
    switch(Motorside) {
        case LS_MOTORS:
        	HAL_GPIO_WritePin(ROBOT_LM_ENABLE_GPIO_PORT, ROBOT_LM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
        	HAL_GPIO_WritePin(ROBOT_LM_FORWARD_GPIO_PORT, ROBOT_LM_FORWARD_GPIO_PIN, GPIO_PIN_SET);
        	HAL_GPIO_WritePin(ROBOT_LM_BACK_GPIO_PORT, ROBOT_LM_BACK_GPIO_PIN, GPIO_PIN_RESET);
            break;
        case RS_MOTORS:
        	HAL_GPIO_WritePin(ROBOT_RM_ENABLE_GPIO_PORT, ROBOT_RM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_RM_FORWARD_GPIO_PORT, ROBOT_RM_FORWARD_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_RM_BACK_GPIO_PORT, ROBOT_RM_BACK_GPIO_PIN, GPIO_PIN_RESET);
            break;
        case ALL_MOTORS:
        	HAL_GPIO_WritePin(ROBOT_LM_ENABLE_GPIO_PORT, ROBOT_LM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_LM_FORWARD_GPIO_PORT, ROBOT_LM_FORWARD_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_LM_BACK_GPIO_PORT, ROBOT_LM_BACK_GPIO_PIN, GPIO_PIN_RESET);

        	HAL_GPIO_WritePin(ROBOT_RM_ENABLE_GPIO_PORT, ROBOT_RM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_RM_FORWARD_GPIO_PORT, ROBOT_RM_FORWARD_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_RM_BACK_GPIO_PORT, ROBOT_RM_BACK_GPIO_PIN, GPIO_PIN_RESET);
            break;
    }

    return 0;
}

int32_t robiot_reverse_motors(Motorside_TypeDef Motorside)
{
    switch(Motorside) {
        case LS_MOTORS:
        	HAL_GPIO_WritePin(ROBOT_LM_ENABLE_GPIO_PORT, ROBOT_LM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_LM_BACK_GPIO_PORT, ROBOT_LM_BACK_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_LM_FORWARD_GPIO_PORT, ROBOT_LM_FORWARD_GPIO_PIN, GPIO_PIN_RESET);
            break;
        case RS_MOTORS:
        	HAL_GPIO_WritePin(ROBOT_RM_ENABLE_GPIO_PORT, ROBOT_RM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_RM_BACK_GPIO_PORT, ROBOT_RM_BACK_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_RM_FORWARD_GPIO_PORT, ROBOT_RM_FORWARD_GPIO_PIN, GPIO_PIN_RESET);
            break;
        case ALL_MOTORS:
        	HAL_GPIO_WritePin(ROBOT_LM_ENABLE_GPIO_PORT, ROBOT_LM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_LM_BACK_GPIO_PORT, ROBOT_LM_BACK_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_LM_FORWARD_GPIO_PORT, ROBOT_LM_FORWARD_GPIO_PIN, GPIO_PIN_RESET);

        	HAL_GPIO_WritePin(ROBOT_RM_ENABLE_GPIO_PORT, ROBOT_RM_ENABLE_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_RM_BACK_GPIO_PORT, ROBOT_RM_BACK_GPIO_PIN, GPIO_PIN_SET);
            HAL_GPIO_WritePin(ROBOT_RM_FORWARD_GPIO_PORT, ROBOT_RM_FORWARD_GPIO_PIN, GPIO_PIN_RESET);
            break;
    }

    return 0;
}

/**
  * @brief  Set robot wheel direction.
  * @param  Direction WHEEL to be set on
  *          This parameter can be one of the following values:
  */
int32_t robiot_set_direction(Direction_TypeDef Direction)
{
    switch(Direction) {
        case ADVANCE: 
        	robiot_advance_motors(ALL_MOTORS);
            break;
        case REVERSE: 
        	robiot_reverse_motors(ALL_MOTORS);
            break;
        case CLOCKWISE:
        	robiot_advance_motors(LS_MOTORS);
        	robiot_reverse_motors(RS_MOTORS);
            break;
        case CCLOCKWISE:
        	robiot_advance_motors(RS_MOTORS);
        	robiot_reverse_motors(LS_MOTORS);
            break;
    }

    return 0;
}

int robiot_motor_control_process_cmd(robiot_mc_t robiot_mc, robiot_mc_cmd_t cmd)
{
    int pwm_speed = 0; /* This is calculated by Gab */

    if ((cmd.cmd_type == STOP) || (cmd.cmd_type == RESET_ROBOT)) {
    	robiot_turn_off_motors(ALL_MOTORS);
    }

    if (cmd.cmd_type == LINEAR) {
        if ((cmd.direction != ADVANCE) && (cmd.direction != REVERSE)) {
            return -1;
        }
        robiot_set_direction(cmd.direction);
        robiot_motor_control_set_pwm(robiot_mc.htim, TIM_CHANNEL, ROBIOT_PWM_PERIOD, pwm_speed);
    }

    if (cmd.cmd_type == ROTATION) {
        if ((cmd.direction != CLOCKWISE) && (cmd.direction != CCLOCKWISE)) {
            return -1;
        }
        robiot_set_direction(cmd.direction);
        robiot_motor_control_set_pwm(robiot_mc.htim, TIM_CHANNEL, ROBIOT_PWM_PERIOD, pwm_speed);
    }
}

void robiot_motor_control_set_pwm(TIM_HandleTypeDef timer, uint32_t channel, uint16_t period, uint16_t pulse)
{
		HAL_TIM_PWM_Stop(&timer, channel);    // stop generation of pwm
		TIM_OC_InitTypeDef sConfigOC;
		timer.Init.Period = period;           // set the period duration
		HAL_TIM_PWM_Init(&timer);  // reinititialise with new period value
		sConfigOC.OCMode = TIM_OCMODE_PWM1;
		sConfigOC.Pulse = pulse;              // set the pulse duration
		sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
		sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
		HAL_TIM_PWM_ConfigChannel(&timer, &sConfigOC, channel);
		HAL_TIM_PWM_Start(&timer, channel);   // start pwm generation}
}

void robiot_motor_control_start_pwm(TIM_HandleTypeDef timer, uint32_t channel, uint16_t period, uint16_t pulse)
{
	HAL_TIM_PWM_Start(&timer, channel);   // start pwm generation}
}

void robiot_motro_control_stop_pwm(TIM_HandleTypeDef timer, uint32_t channel, uint16_t period, uint16_t pulse)
{
	HAL_TIM_PWM_Stop(&timer, channel);    // stop generation of pwm
}

/* Private functions */
int robiot_motor_control_wheel_init(Wheel_TypeDef Wheel)
{
    GPIO_InitTypeDef  gpio_init_structure;

    /* Configure the GPIO_LED pin */
    gpio_init_structure.Mode = GPIO_MODE_OUTPUT_PP;
    gpio_init_structure.Pull = GPIO_PULLUP;
    gpio_init_structure.Speed = GPIO_SPEED_FREQ_HIGH;

//    gpio_init_structure.Pin = ROBOT_LM_ENABLE_GPIO_PIN;
//    HAL_GPIO_Init(ROBOT_LM_ENABLE_GPIO_PORT, &gpio_init_structure);

    gpio_init_structure.Pin = ROBOT_LM_BACK_GPIO_PIN ;
    HAL_GPIO_Init(ROBOT_LM_BACK_GPIO_PORT, &gpio_init_structure);

    gpio_init_structure.Pin = ROBOT_LM_FORWARD_GPIO_PIN;
    HAL_GPIO_Init(ROBOT_LM_FORWARD_GPIO_PORT, &gpio_init_structure);

    gpio_init_structure.Pin = ROBOT_RM_BACK_GPIO_PIN;
    HAL_GPIO_Init(ROBOT_RM_BACK_GPIO_PORT, &gpio_init_structure);

    gpio_init_structure.Pin = ROBOT_RM_FORWARD_GPIO_PIN;
    HAL_GPIO_Init(ROBOT_RM_FORWARD_GPIO_PORT, &gpio_init_structure);

    gpio_init_structure.Pin = ROBOT_RM_ENABLE_GPIO_PIN;
    HAL_GPIO_Init(ROBOT_RM_ENABLE_GPIO_PORT, &gpio_init_structure);

    /* By default, turn off Wheels */
    HAL_GPIO_WritePin(ROBOT_LM_ENABLE_GPIO_PORT, ROBOT_LM_ENABLE_GPIO_PIN, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(ROBOT_LM_BACK_GPIO_PORT, ROBOT_LM_BACK_GPIO_PIN, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(ROBOT_LM_FORWARD_GPIO_PORT, ROBOT_LM_FORWARD_GPIO_PIN, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(ROBOT_RM_BACK_GPIO_PORT, ROBOT_RM_BACK_GPIO_PIN, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(ROBOT_RM_FORWARD_GPIO_PORT, ROBOT_RM_FORWARD_GPIO_PIN, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(ROBOT_RM_ENABLE_GPIO_PORT, ROBOT_RM_ENABLE_GPIO_PIN, GPIO_PIN_RESET);

}

int robiot_motor_control_encoder_init(void)
{
    GPIO_InitTypeDef  gpio_init_structure;

    /* Configure the GPIO_LED pin */
    gpio_init_structure.Mode = GPIO_MODE_OUTPUT_PP;
    gpio_init_structure.Pull = GPIO_PULLUP;
    gpio_init_structure.Speed = GPIO_SPEED_FREQ_HIGH;
    gpio_init_structure.Pin = ROBOT_ENCODER_GPIO_PIN;
    HAL_GPIO_Init(ROBOT_ENCODER_GPIO_PORT, &gpio_init_structure);

    /* By default, turn off LED */
    HAL_GPIO_WritePin(ROBOT_ENCODER_GPIO_PORT, ROBOT_ENCODER_GPIO_PIN, GPIO_PIN_RESET);

}

int robiot_motor_control_hal_init(void)
{
//  for (int wheel = 0; wheel < NUMBER_OF_WHEELS; wheel++) {
//      robiot_motor_control_wheel_init(wheel);
//  }

  robiot_motor_control_wheel_init(0);

  robiot_motor_control_encoder_init();
}

/**
  * @brief TIM5 Initialization Function
  * @param None
  * @retval None
  */
static void MX_TIM5_Init(TIM_HandleTypeDef htim)
{

  /* USER CODE BEGIN TIM5_Init 0 */

  /* USER CODE END TIM5_Init 0 */

  TIM_MasterConfigTypeDef sMasterConfig = {0};
  TIM_OC_InitTypeDef sConfigOC = {0};

  /* USER CODE BEGIN TIM5_Init 1 */

  /* USER CODE END TIM5_Init 1 */
  htim.Instance = TIM5;
  htim.Init.Prescaler = 645;
  htim.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim.Init.Period = 4294967295;
  htim.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
  htim.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_DISABLE;
  if (HAL_TIM_PWM_Init(&htim) != HAL_OK)
  {
    Error_Handler();
  }
  sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
  sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
  if (HAL_TIMEx_MasterConfigSynchronization(&htim, &sMasterConfig) != HAL_OK)
  {
    Error_Handler();
  }
  sConfigOC.OCMode = TIM_OCMODE_PWM1;
  sConfigOC.Pulse = 0;
  sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
  sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
  if (HAL_TIM_PWM_ConfigChannel(&htim, &sConfigOC, TIM_CHANNEL_3) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN TIM5_Init 2 */

  /* USER CODE END TIM5_Init 2 */
  HAL_TIM_MspPostInit(&htim);

}
