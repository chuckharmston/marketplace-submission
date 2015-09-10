import {AddonReviewDetail} from '../reviewDetail';


describe('AddonReviewDetail', () => {
  jsdom();

  const props = {
    addon: {name: 'Add-on', slug: 'add-on'},
    fetchAddon: () => {},
    fetchVersions: () => {},
  };

  it('renders', () => {
    const component = ReactDOMHelper.render(
      <StubRouterProvider Component={AddonReviewDetail}
                          {...props}/>
    );
    assert.equal(ReactDOMHelper.queryClassAll(component, 'addon').length, 1);
  });
});
