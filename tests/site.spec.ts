import { test, expect } from '@playwright/test';

test('语音播放、暂停、继续、停止与错误反馈', async ({ page }) => {
  await page.addInitScript(() => {
    const voiceState = {
      spoken: [] as string[],
      paused: 0,
      resumed: 0,
      canceled: 0,
      last: null as SpeechSynthesisUtterance | null,
    };
    Object.assign(window, { voiceState });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        getVoices: () => [],
        speak: (utterance: SpeechSynthesisUtterance) => {
          voiceState.spoken.push(utterance.text);
          voiceState.last = utterance;
        },
        pause: () => {
          voiceState.paused++;
        },
        resume: () => {
          voiceState.resumed++;
        },
        cancel: () => {
          voiceState.canceled++;
        },
      },
    });
  });
  await page.goto('/#/emperors/tang-tai-zong');
  await page.getByRole('button', { name: '语音讲解', exact: true }).click();
  await expect(page.getByRole('button', { name: '暂停讲解', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '暂停讲解', exact: true }).click();
  await page.getByRole('button', { name: '继续讲解', exact: true }).click();
  const state = await page.evaluate(() => {
    const state = (
      window as unknown as { voiceState: { spoken: string[]; paused: number; resumed: number } }
    ).voiceState;
    return { spoken: state.spoken, paused: state.paused, resumed: state.resumed };
  });
  expect(state.spoken[0]).toContain('李世民');
  expect(state.paused).toBe(1);
  expect(state.resumed).toBe(1);
  await page.getByRole('button', { name: '停止讲解', exact: true }).click();
  await expect(page.getByRole('button', { name: '语音讲解', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '语音讲解', exact: true }).click();
  await page.evaluate(() => {
    const last = (window as unknown as { voiceState: { last: SpeechSynthesisUtterance } })
      .voiceState.last;
    last.dispatchEvent(
      new SpeechSynthesisErrorEvent('error', { error: 'synthesis-failed', utterance: last }),
    );
  });
  await expect(page.getByRole('status')).toContainText('语音服务暂不可用');
});
