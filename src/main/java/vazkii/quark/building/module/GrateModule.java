package vazkii.quark.building.module;

import vazkii.quark.base.module.LoadModule;
import vazkii.quark.base.module.Module;
import vazkii.quark.base.module.ModuleCategory;
import vazkii.quark.building.block.GrateBlock;

/**
 * @author WireSegal
 * Created at 8:57 AM on 8/27/19.
 */
@LoadModule(category = ModuleCategory.BUILDING)
public class GrateModule extends Module {
    public static final ThreadLocal<Boolean> RENDER_SHAPE = ThreadLocal.withInitial(() -> false);

    @Override
    public void construct() {
        new GrateBlock(this);
    }
    
}
