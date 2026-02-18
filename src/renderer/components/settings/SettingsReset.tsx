import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/core/cross';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex, Grid, Inline, xcss } from '@atlaskit/primitives';

import { APPLICATION } from '../../../shared/constants';

import useSettingsStore from '../../stores/useSettingsStore';

const gridStyles = xcss({
  width: '100%',
});

const closeContainerStyles = xcss({
  gridArea: 'close',
});

const titleContainerStyles = xcss({
  gridArea: 'title',
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
        {t('settings.reset.title')}
      </Button>

      <ModalTransition>
        {showResetSettingsModal && (
          <Modal onClose={actionCloseResetSettingsModal}>
            <ModalHeader>
              <Grid
                gap="space.200"
                templateAreas={['title close']}
                xcss={gridStyles}
              >
                <Flex justifyContent="end" xcss={closeContainerStyles}>
                  <IconButton
                    appearance="subtle"
                    icon={CrossIcon}
                    label={t('common.close')}
                    onClick={actionCloseResetSettingsModal}
                    testId="settings-reset-close"
                  />
                </Flex>
                <Flex justifyContent="start" xcss={titleContainerStyles}>
                  <ModalTitle appearance="danger">
                    {t('settings.reset.title')}
                  </ModalTitle>
                </Flex>
              </Grid>
            </ModalHeader>
            <ModalBody>
              <p>
                {t('settings.reset.confirm', { appName: APPLICATION.NAME })}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                appearance="subtle"
                onClick={actionCloseResetSettingsModal}
                testId="settings-reset-cancel"
              >
                {t('common.cancel')}
              </Button>
              <Button
                appearance="danger"
                onClick={() => {
                  resetSettings();
                  actionCloseResetSettingsModal();
                }}
                testId="settings-reset-confirm"
              >
                {t('common.reset')}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </Inline>
  );
};
