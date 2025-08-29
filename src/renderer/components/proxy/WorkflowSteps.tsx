import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CheckCircle, Settings, Download, Shield, Play } from 'lucide-react';

const StepContainer = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.surface};
  border-radius: ${props => props.theme.borderRadius.large};
  border: 1px solid ${props => props.theme.border};
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const StepDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 1rem;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Step = styled(motion.div)<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.large};
  background: ${props => 
    props.$completed ? props.theme.success.main : 
    props.$active ? props.theme.primary.main : 
    props.theme.surfaceVariant};
  color: ${props => 
    props.$completed || props.$active ? '#FFFFFF' : props.theme.textSecondary};
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: ${props => 
    props.$completed || props.$active ? 
    '0 4px 12px rgba(0, 0, 0, 0.15)' : 
    'none'
  };
  min-width: 150px;
  justify-content: center;
`;

const StepIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface WorkflowStepsProps {
  currentStep: number;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = memo(({ currentStep }) => {

  const steps = useMemo(() => [
    {
      id: 1,
      title: '设置提供者',
      icon: Settings,
      description: '配置 VPN 提供者 URL'
    },
    {
      id: 2,
      title: '获取配置',
      icon: Download,
      description: '从 URL 下载配置文件'
    },
    {
      id: 3,
      title: '验证配置',
      icon: Shield,
      description: '检查配置文件有效性'
    },
    {
      id: 4,
      title: '启动代理',
      icon: Play,
      description: '启动 Mihomo 代理服务'
    }
  ], []);

  return (
    <StepContainer>
      <StepHeader>
        <Settings size={24} />
        <div>
          <StepTitle>设置工作流</StepTitle>
          <StepDescription>
            按照以下步骤配置并启动您的代理服务
          </StepDescription>
        </div>
      </StepHeader>
      
      <StepIndicator>
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <Step
              key={step.id}
              $active={isActive}
              $completed={isCompleted}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <StepIcon>
                {isCompleted ? (
                  <CheckCircle size={16} />
                ) : (
                  <step.icon size={16} />
                )}
              </StepIcon>
              {isCompleted ? step.title : isActive ? step.title : `步骤 ${step.id}`}
            </Step>
          );
        })}
      </StepIndicator>
    </StepContainer>
  );
});

WorkflowSteps.displayName = 'WorkflowSteps';

export default WorkflowSteps;