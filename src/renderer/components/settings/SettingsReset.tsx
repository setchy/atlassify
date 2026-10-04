import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex, Inline } from '@atlaskit/primitives/compiled';

import { APPLICATION } from '../../../shared/constants';

import { useSettingsStore } from '../../stores';

const styles = cssMap({
  header: {
    width: '100%',
  },
});

export const SettingsReset: FC = () => {
  const { t } = useTranslation();

  const resetSettings = useSettingsStore((s) => s.reset);
  const [showResetSettingsModal, setShowResetSettingsModal] = useState(false);

  const actionOpenResetSettingsModal = () => {
    setShowResetSettingsModal(true);
  };
  const actionCloseResetSettingsModal = () => {
    setShowResetSettingsModal(false);
  };

  return (
    <Inline alignInline="center">
      <Button
        appearance="danger"
        aria-haspopup="dialog"
        onClick={actionOpenResetSettingsModal}
        testId="settings-reset-defaults"
      >
        {t('settings.reset.title', { defaultValue: 'Reset Settings' })}
      </Button>

      <ModalTransition>
        {showResetSettingsModal && (
          <Modal onClose={actionCloseResetSettingsModal}>
            <ModalHeader>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                xcss={styles.header}
              >
                <ModalTitle appearance="danger">
                  {t('settings.reset.title', {
                    defaultValue: 'Reset Settings',
                  })}
                </ModalTitle>
                <IconButton
                  appearance="subtle"
                  icon={CrossIcon}
                  label={t('common.close', { defaultValue: 'Close' })}
                  onClick={actionCloseResetSettingsModal}
                  testId="settings-reset-close"
                />
              </Flex>
            </ModalHeader>
            <ModalBody>
              <p>
                {t('settings.reset.confirm', {
                  defaultValue:
                    'Please confirm that you want to reset all settings to the {{appName}} defaults.',
                  appName: APPLICATION.NAME,
                })}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                appearance="subtle"
                onClick={actionCloseResetSettingsModal}
                testId="settings-reset-cancel"
              >
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button
                appearance="danger"
                onClick={() => {
                  resetSettings();
                  actionCloseResetSettingsModal();
                }}
                testId="settings-reset-confirm"
              >
                {t('common.reset', { defaultValue: 'Reset' })}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </Inline>
  );
};
