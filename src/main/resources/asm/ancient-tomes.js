function initializeCoreMod() {
    return {
        'redirect-enchantment-list': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.enchantment.EnchantmentHelper',
                'methodName': 'func_82781_a', // getEnchantments
                'methodDesc': '(Lnet/minecraft/item/ItemStack;)Ljava/util/Map;'
            },
            'transformer': function (method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var JumpInsnNode = Java.type('org.objectweb.asm.tree.JumpInsnNode');
                var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
                var LabelNode = Java.type('org.objectweb.asm.tree.LabelNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                var escape = new LabelNode();

                var newInstructions = new InsnList();

                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                newInstructions.add(ASM.buildMethodCall(
                    "vazkii/quark/base/handler/AsmHooks",
                    "getAncientTomeEnchantments",
                    "(Lnet/minecraft/item/ItemStack;)Ljava/util/Map;",
                    ASM.MethodType.STATIC
                ));
                newInstructions.add(new InsnNode(Opcodes.DUP));
                newInstructions.add(new JumpInsnNode(Opcodes.IFNULL, escape));
                newInstructions.add(new InsnNode(Opcodes.ARETURN));
                newInstructions.add(escape);
                newInstructions.add(new InsnNode(Opcodes.POP));

                method.instructions.insertBefore(method.instructions.getFirst(), newInstructions);

                return method;
            }
        }
    }
}
