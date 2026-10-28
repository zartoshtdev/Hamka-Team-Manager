import { beforeEach, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import Providers from '../../app/Providers';
import { emptyWorkspace, loadWorkspace } from '../../shared/lib/storage';
import { useWorkspace } from '../../shared/lib/store';
import MemberForm from './MemberForm';
beforeEach(() => {
  localStorage.clear();
  useWorkspace.setState({ data: emptyWorkspace(), error: '', locked: false });
});
it('validates an empty form and saves a real member through the UI', async () => {
  const user = userEvent.setup();
  render(
    <HashRouter>
      <Providers>
        <MemberForm onClose={() => {}} />
      </Providers>
    </HashRouter>,
  );
  await user.click(screen.getByRole('button', { name: 'ذخیرهٔ عضو' }));
  expect(await screen.findByText('نام حداقل دو حرف باشد.')).toBeInTheDocument();
  expect(useWorkspace.getState().data.members).toHaveLength(0);
  await user.type(screen.getByLabelText('نام و نام خانوادگی'), 'نیما رضایی');
  await user.type(screen.getByLabelText('تخصص یا سمت'), 'طراح محصول');
  await user.click(screen.getByRole('button', { name: 'ذخیرهٔ عضو' }));
  await waitFor(() => expect(loadWorkspace().data.members[0].name).toBe('نیما رضایی'));
});
